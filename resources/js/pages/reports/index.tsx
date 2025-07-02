import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import PaginationItems from "@/components/pagination-items";
import { FormEventHandler, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Eye, Download, Trash2, Plus, FileText } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";
import { getIndexTypeColor, Report, ReportIndexProps } from "@/types/report";

const breadcrumbs: BreadcrumbItem[] = [
  {
      title: 'Reports',
      href: '/reports',
  },
];

export default function ReportIndex({ reports, filters }: ReportIndexProps) {
    const [search, setSearch] = useState<string>(filters.search || '');
    const [isSearching, setIsSearching] = useState<boolean>(false);

    const handleSearch: FormEventHandler = (e) => {
      e.preventDefault();
      setIsSearching(true);
      
      router.get('/reports', 
          { 
            search: search,
            page: 1
          }, 
          {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsSearching(false)
          }
      );
    }

    const handlePageChange = (page: number) => {
      router.get('/reports', 
          { 
            page: page,
            search: filters.search, 
          }, 
          {
            preserveState: true,
            preserveScroll: true
          }
      );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                  <form onSubmit={handleSearch} className="flex items-center space-x-2">                 
                      <Search />
                      <Input
                        placeholder="Search reports..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    
                    <Button type="submit" disabled={isSearching}>
                      {isSearching ? 'Searching...' : 'Search'}
                    </Button>
                  </form>
                  
                  <div className="flex items-center gap-2">
                    {/* Quick Report Buttons */}
                    <Button variant="outline" size="sm">
                      <Link href={route('reports.create', { type: 'monthly' })} className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        Monthly Report
                      </Link>
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <Link href={route('reports.create', { type: 'yearly' })} className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        Yearly Report
                      </Link>
                    </Button>
                    
                    <Button>
                      <Link href={route('reports.create')} className="flex items-center">
                        <Plus className="mr-2 h-4 w-4" />
                        Generate Report
                      </Link>
                    </Button>
                  </div>                
                </div>

                <Table>
                    {reports.data.length > 0 ? 
                      <TableCaption>A list of your generated reports.</TableCaption>
                      :
                      <TableCaption>No reports found. Generate your first report!</TableCaption>
                    }
                    
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Period</TableHead>
                            <TableHead>Generated Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.data.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell className="font-medium">
                                  {report.title.length > 50
                                    ? `${report.title.slice(0, 50)}...`
                                    : report.title
                                  }
                                </TableCell>
                                <TableCell>
                                  <span className={`font-medium ${getIndexTypeColor(report.type)}`}>
                                    {report.type_label}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  {new Date(report.from_date).toLocaleDateString()} - {new Date(report.to_date).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  {formatTimestamp(report.created_at)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="outline">...</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="start">
                                      <DropdownMenuGroup>
                                        <DropdownMenuItem asChild>
                                          <Link href={route('reports.show', report.id)} className="flex items-center">
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Details
                                          </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                          <a href={route('reports.download', report.id)} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                            <Download className="mr-2 h-4 w-4" />
                                            Download PDF
                                          </a>
                                        </DropdownMenuItem>
                                      </DropdownMenuGroup>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem 
                                        className="text-red-600 focus:text-red-600"
                                        onClick={() => {
                                          if (confirm('Are you sure you want to delete this report?')) {
                                            router.delete(route('reports.destroy', report.id));
                                          }
                                        }}
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>  
                </Table>

                <div className="flex justify-center">
                    <PaginationItems<Report> data={reports} handlePageChange={handlePageChange} />
                </div>
            </div>
                 
        </AppLayout>
    )
}
