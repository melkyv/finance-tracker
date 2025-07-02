import HeadingSmall from "@/components/heading-small";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Category, CategoryViewProps } from "@/types/category";
import { Transition } from "@headlessui/react";
import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
    {
        title: 'Category details',
        href: '#',
    },
];

export default function CategoryShow({ category }: CategoryViewProps) {
    const { data, setData, put, delete: destroy, errors, processing, recentlySuccessful, reset, clearErrors } = useForm<Required<Category>>({
        id: category.id,
        name: category.name,
        description: category.description,
        user_id: category.user_id,
        created_at: category.created_at,
        updated_at: category.updated_at,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('categories.update', category.id), {
            preserveScroll: true,
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
    };

    const deleteAccount: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('categories.destroy', category.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Category details" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-12">
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>

                        <Input
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                            placeholder="Category name"
                        />

                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>

                        <Textarea 
                            placeholder="Type category description here." 
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)} 
                        />
                        <p className="text-muted-foreground text-sm">
                            This description is important for understanding your transactions.
                        </p>

                        <InputError className="mt-2" message={errors.description} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save</Button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">Saved</p>
                        </Transition>
                    </div>
                </form>

                <div className="space-y-6">
                    <HeadingSmall title="Delete category" description="Delete your category and all of its resources" />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="destructive">Delete category</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Are you sure you want to delete your category?</DialogTitle>
                            <DialogDescription>
                                Once your category is deleted, all of its resources and data will also be permanently deleted.
                            </DialogDescription>
                            <form className="space-y-6" onSubmit={deleteAccount}>

                                <DialogFooter className="gap-2">
                                    <DialogClose asChild>
                                        <Button variant="secondary" onClick={closeModal}>
                                            Cancel
                                        </Button>
                                    </DialogClose>

                                    <Button variant="destructive" disabled={processing} asChild>
                                        <button type="submit">Delete category</button>
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>                
            </div>
        </AppLayout>
    );
}