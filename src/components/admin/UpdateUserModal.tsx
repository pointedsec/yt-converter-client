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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { UpdateUser } from "@/utils/api"
import { Checkbox } from "../ui/checkbox"
import { useState, useEffect} from "react"
import { User } from "@/types/AuthTypes"

const updateUserSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().optional(), // Make password optional for updates
    role: z.enum(["guest", "admin"], {
        required_error: "Please select a role",
    }),
    active: z.boolean().optional(),
})

type UpdateUserValues = z.infer<typeof updateUserSchema>

export function UpdateUserModal({user, updateCallback}: {user: User, updateCallback: () => void}) {
    const [open, setOpen] = useState(false)
    const form = useForm<UpdateUserValues>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            username: user.username,
            password: "",
            role: user.role as "guest" | "admin",
            active: user.active,
        },
    })
    const isAdminUser = user.id === "1"

    useEffect(() => {
        form.reset({
            username: user.username,
            password: "",
            role: user.role as "guest" | "admin",
            active: user.active,
        })
    }, [user, form])

    const onSubmit = async (values: UpdateUserValues) => {
        const updatedUser = {
            ...user,
            username: values.username,
            role: values.role,
            active: values.active,
            ...(values.password && { password: values.password }),
        }

        const res = await UpdateUser({ user: updatedUser })
        if ('error' in res) {
            alert(res.error)
            return 
        }
        updateCallback()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="cursor-pointer">
                    Edit User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[725px]">
                <DialogHeader>
                    <DialogTitle>Update {user.username}</DialogTitle>
                    <DialogDescription>
                        Update the user's information and permissions here.
                        {isAdminUser && (
                            <div className="mt-2 p-3 bg-yellow-50 text-yellow-800 rounded-md">
                                Note: Administrator account cannot modify username, role, or active status.
                            </div>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="username" className="text-right">
                                            Username
                                        </Label>
                                        <FormControl>
                                            <Input 
                                                {...field} 
                                                className="col-span-3"
                                                disabled={isAdminUser}
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="role" className="text-right">
                                            Role
                                        </Label>
                                        <Select 
                                            onValueChange={field.onChange} 
                                            defaultValue={field.value}
                                            disabled={isAdminUser}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Roles</SelectLabel>
                                                    <SelectItem value="guest">Guest</SelectItem>
                                                    <SelectItem value="admin">Administrator</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="password" className="text-right">
                                            New Password
                                        </Label>
                                        <FormControl>
                                            <Input 
                                                type="password" 
                                                {...field} 
                                                className="col-span-3"
                                                placeholder="Leave empty to keep current password"
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="active"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="active" className="text-right">
                                            Active
                                        </Label>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="active"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isAdminUser}
                                            />
                                        </div>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" className="cursor-pointer">Update User</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
