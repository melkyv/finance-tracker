import HeadingSmall from "@/components/heading-small";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Account, AccountViewProps } from "@/types/account";
import { Transition } from "@headlessui/react";
import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accounts',
        href: '/accounts',
    },
    {
        title: 'Account details',
        href: '#',
    },
];

export default function AccountShow({ account }: AccountViewProps) {
    const { data, setData, put, delete: destroy, errors, processing, recentlySuccessful, reset, clearErrors } = useForm<Required<Account>>({
        id: account.id,
        name: account.name,
        type: account.type,
        balance: account.balance,
        user_id: account.user_id,
        created_at: account.created_at,
        updated_at: account.updated_at,
        type_label: account.type_label
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('accounts.update', account.id), {
            preserveScroll: true,
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
    };

    const deleteAccount: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('accounts.destroy', account.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Accounts" />

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
                            placeholder="Account name"
                        />

                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="type">Type</Label>

                        <RadioGroup defaultValue={data.type} onValueChange={(e) => setData('type', e)}>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="debit" id="r1"/>
                                <Label htmlFor="r1">Debit</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="savings" id="r2" />
                                <Label htmlFor="r2">Savings</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="credit" id="r3" />
                                <Label htmlFor="r3">Credit Card</Label>
                            </div>
                        </RadioGroup>

                        <InputError className="mt-2" message={errors.type} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="balance">Balance</Label>

                        <Input
                            type="number"
                            id="balance"
                            className="mt-1 block w-full"
                            value={data.balance}
                            onChange={(e) => setData('balance', parseFloat(e.target.value))}
                            required
                            autoComplete="balance"
                            placeholder="0.00"
                        />

                        <InputError className="mt-2" message={errors.balance} />
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
                    <HeadingSmall title="Delete account" description="Delete your account and all of its resources" />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="destructive">Delete account</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
                            <DialogDescription>
                                Once your account is deleted, all of its resources and data will also be permanently deleted.
                            </DialogDescription>
                            <form className="space-y-6" onSubmit={deleteAccount}>

                                <DialogFooter className="gap-2">
                                    <DialogClose asChild>
                                        <Button variant="secondary" onClick={closeModal}>
                                            Cancel
                                        </Button>
                                    </DialogClose>

                                    <Button variant="destructive" disabled={processing} asChild>
                                        <button type="submit">Delete account</button>
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