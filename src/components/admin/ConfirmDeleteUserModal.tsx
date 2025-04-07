import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { User } from "@/types/AuthTypes"
import { useState } from "react"
import { DeleteUser } from "@/utils/api"

export function ConfirmDeleteUserModal({ user, deleteCallback }: { user: User, deleteCallback: () => void }) {
    const [forceDelete, setForceDelete] = useState(false)
    const [open, setOpen] = useState(false)
    const handleDeleteUser = async () => {
        const res = await DeleteUser({user, forceDelete})
        if ('error' in res) {
            alert(res.error)
            return
        } else {
            deleteCallback()
            setOpen(false)
          }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" className="cursor-pointer">Delete user</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        <div>
                            This action will deactivate user <b>{user.username}</b>. You can force the deletion of user <b>{user.username}</b> by checking the force delete box.
                        </div>
                        <div className="flex items-center space-x-2 mt-4">
                            <Checkbox 
                                id="force-delete" 
                                checked={forceDelete}
                                onCheckedChange={(checked) => setForceDelete(checked as boolean)}
                            />
                            <label 
                                htmlFor="force-delete" 
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Force delete user
                            </label>
                        </div>
                        {forceDelete && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    Force delete will permanently remove:
                                    <ul className="list-disc pl-4 mt-2">
                                        <li>User account and all associated data</li>
                                        <li>All converted videos</li>
                                        <li>All videos stored in the storage system</li>
                                    </ul>
                                    This action cannot be undone.
                                </AlertDescription>
                            </Alert>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="submit" onClick={handleDeleteUser}>Delete User</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
