//components/edit/SuccessModal.tsx

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button
  } from "@mui/material";
  
  interface SuccessModalProps {
    open: boolean;
    onClose: () => void;
  }
  
  const SuccessModal = ({ open, onClose }: SuccessModalProps) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>상품 수정 완료</DialogTitle>
        <DialogContent>
          <DialogContentText>
            상품 정보가 성공적으로 수정되었습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" autoFocus>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
export default SuccessModal;
