export{};

declare global {
    interface Window {
        dataLayer: unkown[];
        gtag: (...args: unknown[]) => void;
    }
}