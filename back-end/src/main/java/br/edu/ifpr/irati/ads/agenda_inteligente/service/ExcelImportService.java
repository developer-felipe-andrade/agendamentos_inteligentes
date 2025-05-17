package br.edu.ifpr.irati.ads.agenda_inteligente.service;

import br.edu.ifpr.irati.ads.agenda_inteligente.dao.UserRepository;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.User;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.enums.UserProfession;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.enums.UserRole;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Service
public class ExcelImportService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Map<String, Object> importUsersFromExcel(MultipartFile file) throws IOException {
        List<User> importedUsers = new ArrayList<>();
        List<String> skippedUsers = new ArrayList<>();

        try (InputStream is = file.getInputStream()) {
            Workbook workbook;

            if (file.getOriginalFilename().endsWith(".xlsx")) {
                workbook = new XSSFWorkbook(is);
            } else if (file.getOriginalFilename().endsWith(".xls")) {
                workbook = new HSSFWorkbook(is);
            } else {
                throw new IllegalArgumentException("Arquivo não é um Excel válido");
            }

            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            // Pular a linha de cabeçalho
            if (rows.hasNext()) {
                rows.next();
            }

            while (rows.hasNext()) {
                Row currentRow = rows.next();

                if (isRowEmpty(currentRow)) {
                    continue;
                }

                User user = new User();
                Cell emailCell = currentRow.getCell(0);
                if (emailCell != null) {
                    user.setLogin(getCellValueAsString(emailCell));
                }

                Cell nameCell = currentRow.getCell(1);
                if (nameCell != null) {
                    user.setName(getCellValueAsString(nameCell));
                }

                Cell passwordCell = currentRow.getCell(2);
                if (passwordCell != null) {
                    String rawPassword = getCellValueAsString(passwordCell);
                    user.setPassword(passwordEncoder.encode(rawPassword));
                }
                Cell roleCell = currentRow.getCell(3);
                if (roleCell != null) {
                    String roleName = getCellValueAsString(roleCell);
                    UserRole role = "usuário".equalsIgnoreCase(roleName) ?
                            UserRole.USER : findUserRoleByName(roleName);
                    user.setRole(role);
                } else {
                    user.setRole(UserRole.USER);
                }

                Cell professionCell = currentRow.getCell(4);
                if (professionCell != null) {
                    String professionName = getCellValueAsString(professionCell);
                    UserProfession profession = "servidor".equalsIgnoreCase(professionName) ?
                            UserProfession.WORKER : findUserProfessionByName(professionName);
                    user.setProfession(profession);
                }

                user.setEnabled(true);
                user.setTmpPassword(true);
                user.setPhoneNumber("");

                if (userRepository.findByLogin(user.getLogin()) == null) {
                    importedUsers.add(user);
                } else {
                    skippedUsers.add(user.getLogin());
                }
            }

            workbook.close();
        }

        // Salvar todos os usuários no banco de dados
        List<User> savedUsers = userRepository.saveAll(importedUsers);

        // Preparar o resultado
        Map<String, Object> result = new HashMap<>();
        result.put("importedUsers", savedUsers);
        result.put("importedCount", savedUsers.size());
        result.put("skippedUsers", skippedUsers);
        result.put("skippedCount", skippedUsers.size());

        return result;
    }

    private String getCellValueAsString(Cell cell) {
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                return String.valueOf((int) cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return "";
        }
    }

    private boolean isRowEmpty(Row row) {
        for (int cellNum = 0; cellNum < 5; cellNum++) {
            Cell cell = row.getCell(cellNum);
            if (cell != null && cell.getCellType() != CellType.BLANK) {
                return false;
            }
        }
        return true;
    }

    private UserRole findUserRoleByName(String roleName) {
        // Mapeia os nomes em português para os valores enum
        switch (roleName.toLowerCase()) {
            case "admin":
            case "administrador":
                return UserRole.ADMIN;
            case "coordenador":
                return UserRole.COORDINATOR;
            case "usuário":
            case "usuario":
            default:
                return UserRole.USER;
        }
    }

    private UserProfession findUserProfessionByName(String professionName) {
        // Mapeia os nomes em português para os valores enum
        switch (professionName.toLowerCase()) {
            case "servidor":
            case "worker":
                return UserProfession.WORKER;
            case "estudante":
            case "aluno":
                return UserProfession.STUDENT;
            case "comunidade externa":
            case "externo":
                return UserProfession.EXTERNAL_COMUNITY;
            default:
                return UserProfession.WORKER; // padrão conforme solicitado
        }
    }
}