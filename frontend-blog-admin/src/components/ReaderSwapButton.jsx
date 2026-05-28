import { useLocation } from "react-router-dom";

export default function ReaderSwapButton() {
    const location = useLocation();
    const readerBaseUrl = import.meta.env.VITE_READER_SITE_URL;
    let nonAdminPath = location.pathname.replace("/admin", "");
    if (nonAdminPath.includes("newPost")) {
        nonAdminPath = "/"
    } else if (nonAdminPath.includes("edit")) {
        console.log("edit path before", nonAdminPath);
        nonAdminPath = nonAdminPath.replace("/edit", "");
        console.log("edit path after", nonAdminPath)

    }
    const targetURL = `${readerBaseUrl}${nonAdminPath}`;
    return (
        <a href={targetURL}>
            Open page in reader dashboard
        </a>
    )
}