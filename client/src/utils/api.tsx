import axios, {type AxiosResponse} from "axios";
import type { ProductType } from "../types";


export const getProducts =
async (): Promise<AxiosResponse<{products: ProductType[] }>> => {
    try{
        const response = await axios.get("/product");
        return response;
    }catch(error){
        throw error;
    }
};

export const getProduct = async (
    id: string
): Promise<AxiosResponse<{product: ProductType}>> => {
    try{
        const response = axios.get(`/product/${id}`);
        return response;
    }catch(error){
        throw error;
    }
};

export const createProduct = async(
    newProduct: Omit<ProductType, "id" | "thumbnail">
): Promise<AxiosResponse<{product: ProductType}>> => {
    try{
        const response = await axios.post("/product", newProduct);
        return response;
    }catch(error){
        throw error;
    }
};

export const modifyThumbnail = async (
    productId: string,
    thumbnail: File
): Promise<AxiosResponse<{product: ProductType}>> => {
    try{
        const formData = new FormData();
        formData.append("thumbnail", thumbnail);
        const response = axios.patch(`/product/thumbnail/${productId}`, formData);
        return response;
    }catch(error) {
        throw error;
    }
};

export const deleteProduct = async (id: string) => {
    try{
        const response = await axios.delete(`/product/${id}`);
        return response;
    }catch(error) {
        throw error;
    }
};

export const modifyProduct = async (updateProduct: Omit<ProductType, "thumbnail">) => {
    try {
        const {id, ...payload} = updateProduct;
        const response = await axios.patch(`/product/${id}`, payload);
        return response;
    }catch (error) {
        throw error;
    }
};