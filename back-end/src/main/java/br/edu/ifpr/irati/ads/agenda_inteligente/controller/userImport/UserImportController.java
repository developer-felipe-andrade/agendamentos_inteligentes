package br.edu.ifpr.irati.ads.agenda_inteligente.controller.userImport;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.User;
import br.edu.ifpr.irati.ads.agenda_inteligente.service.ExcelImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class UserImportController {
    @Autowired
    private ExcelImportService excelImportService;

    @PostMapping("/import-users")
    public ResponseEntity<?> importUsersFromExcel(@RequestParam("file") MultipartFile file) {
        try {
            // Verificar se o arquivo está vazio
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Por favor, envie um arquivo Excel válido.");
            }

            // Verificar se é um arquivo Excel
            if (!file.getOriginalFilename().endsWith(".xls") && !file.getOriginalFilename().endsWith(".xlsx")) {
                return ResponseEntity.badRequest().body("Por favor, envie um arquivo com extensão .xls ou .xlsx");
            }

            // Importar usuários do Excel
            Map<String, Object> importResult = excelImportService.importUsersFromExcel(file);

            // Criar resposta com informações sobre a importação
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Importação realizada com sucesso");
            response.put("totalImportados", importResult.get("importedCount"));
            response.put("totalIgnorados", importResult.get("skippedCount"));
            response.put("usuariosIgnorados", importResult.get("skippedUsers"));

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Erro ao processar o arquivo: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro na importação: " + e.getMessage());
        }
    }
}
