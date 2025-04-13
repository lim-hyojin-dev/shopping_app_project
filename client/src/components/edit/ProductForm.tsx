// components/edit/ProductForm.tsx
import { useState, useEffect } from "react";
import { 
  Button, 
  TextField, 
  Typography, 
  Box, 
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ThumbnailUploader from "./ThumbnailUploader";
import { createProduct, modifyProduct, modifyThumbnail, getProduct } from "../../utils/api";
import useAsync from "../../hooks/useAsync";
import { API_SERVER_DOMAIN } from "../../constants";

interface ProductFormProps {
  mode: 'create' | 'edit';
  productId?: string;
  onSuccess?: (productId: string) => void;
}

const ProductForm = ({ mode, productId, onSuccess }: ProductFormProps) => {
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [explanation, setExplanation] = useState("");
  const [price, setPrice] = useState(0);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState<string | null>(null);
    
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdProductId, setCreatedProductId] = useState("");

  const { request: createProductRequest } = useAsync(createProduct, { initialRequest: false });
  const { request: modifyProductRequest } = useAsync(modifyProduct, { initialRequest: false });
  const { request: thumbnailUploadRequest } = useAsync(modifyThumbnail, { initialRequest: false });

  useEffect(() => {
    if (mode === 'edit' && productId) {
      const loadProduct = async () => {
        try {
          setIsLoading(true);
          const response = await getProduct(productId);

          if (response && response.data && response.data.product) {
            const product = response.data.product;
            setName(product.name);
            setExplanation(product.explanation);
            setPrice(product.price);

            if (product.thumbnail) {
              setCurrentThumbnailUrl(product.thumbnail);
            }
          } else {
            setError("상품 정보를 불러올 수 없습니다.");
          }
        } catch (err) {
          setError("상품 정보를 불러오는 중 오류가 발생했습니다.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      loadProduct();
    }
  }, [mode, productId]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(Number(event.target.value));
  };

  const handleExplanationChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setExplanation(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (mode === 'create') {
        const createResponse = await createProductRequest({
          name,
          explanation,
          price,
        });
        const newProductId = createResponse.data.product.id;
        setCreatedProductId(newProductId);

        if (thumbnail) {
          await thumbnailUploadRequest(newProductId, thumbnail);
        }

        setIsModalOpen(true);
      } else if (mode === 'edit' && productId) {
        await modifyProductRequest({
          id: productId,
          name,
          explanation,
          price,
        });

        if (thumbnail) {
          await thumbnailUploadRequest(productId, thumbnail);
        }

        if (onSuccess) {
          onSuccess(productId);
        }
      }
    } catch (err) {
      setError(mode === 'create' ? "상품 생성 중 오류가 발생했습니다." : "상품 수정 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate(`/product/${createdProductId}`);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <CircularProgress />
        <Typography variant="h6">상품 정보를 불러오는 중...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">{error}</Typography>
        <Button variant="contained" onClick={handleCancel} sx={{ mt: 2 }}>
          뒤로 가기
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField 
          label="상품 이름" 
          fullWidth 
          value={name}
          onChange={handleNameChange}
          required
        />
        <TextField 
          label="가격" 
          type="number" 
          fullWidth 
          value={price}
          onChange={handlePriceChange}
          required
        />
        <TextField 
          label="상품 설명" 
          fullWidth 
          multiline 
          rows={4}
          value={explanation}
          onChange={handleExplanationChange}
          required
        />

        {mode === 'edit' && currentThumbnailUrl && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">현재 썸네일:</Typography>
            <img 
              src={`${API_SERVER_DOMAIN}/${currentThumbnailUrl}`}
              alt="현재 썸네일" 
              style={{ maxWidth: '100%', maxHeight: 200 }}
            />
          </Box>
        )}

        <ThumbnailUploader 
          value={thumbnail}
          onChange={(file: File | null) => setThumbnail(file)}
        />

        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={handleCancel}
            fullWidth
          >
            취소
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
          >
            {mode === 'create' ? '생성하기' : '수정하기'}
          </Button>
        </Box>
      </Box>

      <Dialog
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="success-dialog-title"
      >
        <DialogTitle id="success-dialog-title">
          상품을 성공적으로 {mode === 'create' ? '추가' : '수정'}했습니다.
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            확인을 누르면 상품 상세 페이지로 이동합니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} autoFocus>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductForm;
