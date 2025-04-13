//pages/ProductCreatePage.tsx

import { Container, Typography } from "@mui/material";
import { ProductForm } from "../components/edit";

const ProductCreatePage = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        상품 생성
      </Typography>
      <ProductForm mode="create" />
    </Container>
  );
};

export default ProductCreatePage;
