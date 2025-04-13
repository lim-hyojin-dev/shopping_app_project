//pages/ProductEditPage.tsx

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";
import { ProductForm } from "../components/edit";
import { SuccessModal } from "../components/edit";

const ProductEditPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate(`/product/${productId}`);
  };

  if (!productId) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h6" color="error">
          상품 ID가 없습니다.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ pb: 8 }}> 
        <Typography variant="h4" gutterBottom>
          상품 수정
        </Typography>
        
        <ProductForm 
          mode="edit"
          productId={productId} 
          onSuccess={() => handleSuccess()} 
        />
        
        <SuccessModal 
          open={isModalOpen} 
          onClose={handleModalClose} 
        />
      </Box>
    </Container>
  );
};

export default ProductEditPage;
