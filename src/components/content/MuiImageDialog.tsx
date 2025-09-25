import * as React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

export default function MuiImageDialog({ open, onClose, onInsert }: { open: boolean; onClose: () => void; onInsert: (src: string, alt: string) => void }) {
  const [src, setSrc] = React.useState("");
  const [alt, setAlt] = React.useState("");

  function handleInsert() {
    if (src) {
      onInsert(src, alt);
      setSrc("");
      setAlt("");
      onClose();
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Vložit obrázek</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="URL obrázku"
          type="url"
          fullWidth
          variant="outlined"
          value={src}
          onChange={e => setSrc(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Popisek (alt)"
          type="text"
          fullWidth
          variant="outlined"
          value={alt}
          onChange={e => setAlt(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Zrušit</Button>
        <Button onClick={handleInsert} variant="contained" color="primary">Vložit</Button>
      </DialogActions>
    </Dialog>
  );
}
