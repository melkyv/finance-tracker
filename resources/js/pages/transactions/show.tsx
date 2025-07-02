import HeadingSmall from "@/components/heading-small";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { getTypeColor, TransactionViewProps } from "@/types/transaction";
import { Head, useForm, Link } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { Edit } from "lucide-react";
import { formatCurrency, formatTimestamp } from "@/lib/utils";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transactions',
        href: '/transactions',
    },
    {
        title: 'Transaction details',
        href: '#',
    },
];

export default function TransactionShow({ transaction }: TransactionViewProps) {
    const { delete: destroy, processing, clearErrors, reset } = useForm();

    const closeModal = () => {
        clearErrors();
        reset();
    };

    const deleteTransaction: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('transactions.destroy', transaction.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaction Details" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-8">
                <div className="flex items-center justify-between">                
                    <Button asChild>
                        <Link href={route('transactions.edit', transaction.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Transaction
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Transaction Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium">Description</h3>
                                <p className="mt-1 text-sm text-gray-500">{transaction.description ?? 'N/A'}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium">Amount</h3>
                                <p className={`mt-1 text-lg font-semibold ${getTypeColor(transaction.type).split(' ')[0]}`}>
                                    {formatCurrency(transaction.amount)}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium">Type</h3>
                                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(transaction.type)}`}>
                                    {transaction.type_label}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium">Account</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {transaction.account?.name} ({transaction.account?.type_label})
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium">Category</h3>
                                <p className="mt-1 text-sm text-gray-500">{transaction.category?.name}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium">Created At</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {formatTimestamp(transaction.created_at)}
                                </p>
                            </div>
                        </div>

                        {transaction.category?.description && (
                            <div>
                                <h3 className="text-sm font-medium">Category Description</h3>
                                <p className="mt-1 text-sm text-gray-500">{transaction.category.description}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <HeadingSmall 
                        title="Delete transaction" 
                        description="Delete this transaction permanently. This action cannot be undone." 
                    />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="destructive">Delete transaction</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Are you sure you want to delete this transaction?</DialogTitle>
                            <DialogDescription>
                                Once this transaction is deleted, all of its data will be permanently removed. This action cannot be undone.
                            </DialogDescription>
                            <form className="space-y-6" onSubmit={deleteTransaction}>
                                <DialogFooter className="gap-2">
                                    <DialogClose asChild>
                                        <Button variant="secondary" onClick={closeModal}>
                                            Cancel
                                        </Button>
                                    </DialogClose>

                                    <Button variant="destructive" disabled={processing} asChild>
                                        <button type="submit">Delete transaction</button>
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

