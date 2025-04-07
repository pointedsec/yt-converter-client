import { Link } from "react-router-dom"
import { Button } from "../ui/button"

export default function AdminButtons () {
    return (
        <div className="flex gap-2">
            <Link to="/admin">
                <Button variant="outline" className="cursor-pointer">Users Dashboard</Button>
            </Link>
            <Button variant="outline" className="cursor-pointer">Admin button 3</Button>
            <Button variant="outline" className="cursor-pointer">Admin button 2</Button>
        </div>
    )
}