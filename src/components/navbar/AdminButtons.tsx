import { Link } from "react-router-dom"
import { Button } from "../ui/button"

export default function AdminButtons() {
    return (
        <>
            <Link to="/admin">
                <Button variant="outline" className="cursor-pointer">Users Dashboard</Button>
            </Link>
            <Link to="/admin/videos">
                <Button variant="outline" className="cursor-pointer">Videos Dashboard</Button>
            </Link>
            <Link to="/admin/cookies">
                <Button variant="outline" className="cursor-pointer">Handle Cookies File</Button>
            </Link>
        </>
    )
}