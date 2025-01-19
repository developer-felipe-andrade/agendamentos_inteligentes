package br.edu.ifpr.irati.ads.agenda_inteligente.controller.whatsapp;

public record MessageRequest(
    String number,
    String message
) {}
