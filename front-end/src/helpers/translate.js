export function translateProfession(role) {
    const translations = {
        WORKER: "Servidor",
        STUDENT: "Aluno",
        EXTERNAL_COMUNITY: "Comunidade externa"
    };

    return translations[role] || "Papel não encontrado";
}

export function translateRole(role) {
    const translations = {
        ADMIN: "Administrador",
        USER: "Aluno",
        COORDINATOR: "Coordenador"
    };

    return translations[role] || "Cargo não encontrado";
}