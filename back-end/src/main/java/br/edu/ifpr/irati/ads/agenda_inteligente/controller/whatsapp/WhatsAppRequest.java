package br.edu.ifpr.irati.ads.agenda_inteligente.controller.whatsapp;

public record WhatsAppRequest(
        String to,
        String message
) {}