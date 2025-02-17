import { useState } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Rating, CircularProgress } from "@mui/material";
import review from "../../api/requests/review";

const ReviewDialog = ({ open, onClose, reservationsId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await reservationsId.forEach(reservationId => {
        review.register(reservationId.id, { rating, comment });
      })

      setRating(0);
      setComment("");
      onClose();
    } catch (error) {
      console.error("Erro ao salvar avaliação:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} disableEscapeKeyDown>
      <DialogTitle>Avaliação</DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <Rating
          name="rating"
          value={rating}
          onChange={(event, newValue) => setRating(newValue)}
          size="large"
        />
        <TextField
          label="Observações"
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={loading || rating === 0}
        >
          {loading ? <CircularProgress size={24} /> : "Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ReviewDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  reservationsId: PropTypes.array.isRequired,
};

export default ReviewDialog;
