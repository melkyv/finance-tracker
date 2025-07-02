import { PaginationData } from "@/types/pagination"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";

type PaginationItemsProps<T> = {
    data: PaginationData<T>,
    handlePageChange: (page: number) => void
}

export default function PaginationItems<T>({ data, handlePageChange }: PaginationItemsProps<T>) {

    const renderPaginationItems = () => {
        const items = [];
        const currentPage = data.current_page;
        const lastPage = data.last_page;

        // Determinar o range de páginas para mostrar
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(lastPage, currentPage + 2);

        // Ajustar se estivermos no início ou fim
        if (currentPage <= 3) {
            endPage = Math.min(5, lastPage);
        }
        if (currentPage >= lastPage - 2) {
            startPage = Math.max(1, lastPage - 4);
        }

        // Primeira página
        if (startPage > 1) {
            items.push(
                <PaginationItem key={1}>
                    <PaginationLink
                        onClick={() => handlePageChange(1)}
                        isActive={currentPage === 1}
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            if (startPage > 2) {
                items.push(
                    <PaginationItem key="ellipsis-start">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
        }

        // Páginas do range
        for (let page = startPage; page <= endPage; page++) {
            items.push(
                <PaginationItem key={page}>
                    <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                    >
                        {page}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // Última página
        if (endPage < lastPage) {
            if (endPage < lastPage - 1) {
                items.push(
                    <PaginationItem key="ellipsis-end">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            items.push(
                <PaginationItem key={lastPage}>
                    <PaginationLink
                        onClick={() => handlePageChange(lastPage)}
                        isActive={currentPage === lastPage}
                    >
                        {lastPage}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    return (
        <div>
            {data.last_page > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => handlePageChange(data.current_page - 1)}
                                className={data.current_page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                        </PaginationItem>

                        {renderPaginationItems()}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => handlePageChange(data.current_page + 1)}
                                className={data.current_page >= data.last_page ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    )
}