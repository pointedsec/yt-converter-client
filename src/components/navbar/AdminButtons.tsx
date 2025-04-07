import { Link } from "react-router-dom"
import { Button } from "../ui/button"

export default function AdminButtons () {
    return (
        <div className="flex gap-2 cursor-pointer">
            <Link to="/admin">
                <Button variant="outline">Users Dashboard</Button>
            </Link>
            <Button variant="outline">Admin button 2</Button>
            <Button variant="outline">Admin button 3</Button>
        </div>
    )
}