// contexts /ProductContext.tsx
import { createContext, useContext, useState } from "react";

type ProductContextType=[
    ProductType[],
    React.Dispatch<React.SetStateAction<ProductType[]>>
];

interface ProductType {
    id: number;
    name: string;
    explanation: string;
    price: number;
}

const ProductContext = createContext<ProductContextType | null>(null);
const initialValue: ProductType[] = [
    {
        id: 0,
        name: "Iphone 13 Max",
        explanation: '디스플레이는 6.1인치 19.5:9 비율의 2532x1170 해상도를 지원하며 패널 형식은 AMOLED 방식의 Super Retina XDR 디스플레이다. 인치당 픽셀 수는 460ppi이다. 120Hz의 터치 샘플링 레이트를 제공하고 명암비는 2,000,000:1이다',
        price: 1230000,
    },
];

export function ProductProvider({children}: {children: React.ReactNode}) {
    const productState = useState<ProductType[]>(initialValue);

    return(
        <ProductContext.Provider value={productState}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProductContext() {
    return useContext(ProductContext) as ProductContextType;
}