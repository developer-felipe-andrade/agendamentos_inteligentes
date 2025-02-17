package br.edu.ifpr.irati.ads.agenda_inteligente.controller.review;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.classroom.ClassroomResponse;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.reservation.ReservationResponse;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.user.UserResponse;

public record ReviewResponse(
    String id,
    ClassroomResponse classroomResponse,
    ReservationResponse reservationResponse,
    Integer rating,
    String comment,
    Boolean pending
) {

}
