import useAppStore from "~/stores/appStore";
import SpinnerLoading from "../ui/SpinnerLoading/SpinnerLoading";

function LoadingOverlay() {
    const isLoading = useAppStore(s => s.isLoading); // hoặc s.anyLoading() nếu dùng loadingMap
    if (!isLoading) return null;

    return <SpinnerLoading />
}

export default LoadingOverlay