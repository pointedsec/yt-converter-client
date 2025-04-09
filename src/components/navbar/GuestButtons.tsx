import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function GuestButtons () {
    return (
        <div className="flex gap-2">
            <Link to='/convert'><Button variant="outline" className="cursor-pointer">Convert a video</Button></Link>
            <Button variant="outline" className="cursor-pointer">Recent queries</Button>
            <Button variant="outline" className="cursor-pointer">Converted history</Button>
        </div>
    )
}