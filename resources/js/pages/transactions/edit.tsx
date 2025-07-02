import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { TransactionForm, TransactionEditProps } from "@/types/transaction";
import { Head, useForm, Link } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { ArrowLeft } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transactions',
        href: '/transactions',
    },
    {
        title: 'Edit Transaction',
        href: '#',
    },
];

export default function TransactionEdit({ transaction, categories }: TransactionEditProps) {
    const { data, setData, put, processing, errors } = useForm<Required<TransactionForm>>({
        account_id: transaction.account_id,
        category_id: transaction.category_id,
        description: transaction.description ?? '',
        amount: transaction.amount,
        type: transaction.type,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('transactions.update', transaction.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Transaction" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-10">
                <div className="flex items-center justify-between">
                    <Button variant="outline" asChild>
                        <Link href={route('transactions.show', transaction.id)}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Transaction
                        </Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="account_id">Account</Label>
                        
                        <Select value={data.account_id.toString()} disabled>
                            <SelectTrigger>
                                <SelectValue placeholder="Account" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem key={data.account_id} value={data.account_id.toString()}>
                                    {transaction.account?.name} ({transaction.account?.type_label})
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category_id">Category</Label>
                        
                        <Select value={data.category_id.toString()} onValueChange={(value) => setData('category_id', parseInt(value))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <InputError className="mt-2" message={errors.category_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="type">Transaction Type</Label>
                        
                        <Select value={data.type} disabled>
                            <SelectTrigger>
                                <SelectValue placeholder="Transaction type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem key={transaction.type} value={transaction.type}>
                                    {transaction.type_label}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>

                        <Textarea
                            id="description"
                            className="mt-1 block w-full"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Transaction description"
                            rows={3}
                        />

                        <InputError className="mt-2" message={errors.description} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>

                        <Input
                            type="number"
                            step="0.01"
                            min="0.01"
                            id="amount"
                            className="mt-1 block w-full"
                            value={data.amount}
                            disabled
                            required
                            placeholder="0.00"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>
                            {processing ? 'Updating...' : 'Update Transaction'}
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href={route('transactions.show', transaction.id)}>
                                Cancel
                            </Link>
                        </Button>
                    </div>
                </form>              
            </div>
        </AppLayout>
    );
}

