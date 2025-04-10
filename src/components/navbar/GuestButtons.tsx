import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function GuestButtons() {
    return (
        <>
            <Link to='/convert'><Button variant="outline" className="cursor-pointer">Convert a video</Button></Link>
            <Link to='/recent'><Button variant="outline" className="cursor-pointer">Recent queries</Button></Link>
            <Button variant="outline" className="cursor-pointer">Converted history</Button>
        </>
    )
}