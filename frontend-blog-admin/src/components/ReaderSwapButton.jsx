import { useLocation } from "react-router-dom";

export default function ReaderSwapButton() {
    const location = useLocation();
    const readerBaseUrl = import.meta.env.VITE_READER_SITE_URL;
    let nonAdminPath = location.pathname.replace("/admin", "");
    const targetURL = `${readerBaseUrl}${nonAdminPath}`;
    return(
        <a href={targetURL}>
            Open page in reader dashboard
        </a>
    )
}