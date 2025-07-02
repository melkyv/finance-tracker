import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, FileText, TrendingUp } from "lucide-react";
import InputError from "@/components/input-error";
import { FormEventHandler, useEffect } from "react";
import { generateDefaultTitle, ReportCreateProps } from "@/types/report";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Reports',
    href: '/reports',
  },
  {
    title: 'Generate Report',
    href: '/reports/create',
  },
];

export default function ReportCreate({ reportTypes, quickReport }: ReportCreateProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: quickReport?.title || '',
    type: quickReport?.type || '',
    from_date: quickReport?.from_date || '',
    to_date: quickReport?.to_date || '',
  });

  // Update form when quickReport changes
  useEffect(() => {
    if (quickReport) {
      setData({
        title: quickReport.title,
        type: quickReport.type,
        from_date: quickReport.from_date,
        to_date: quickReport.to_date,
      });
    }
  }, [quickReport, setData]);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('reports.store'), {
      onSuccess: () => reset(),
    });
  };

  const handleTypeChange = (type: string) => {
    setData(prev => ({
      ...prev,
      type,
      title: generateDefaultTitle(type)
    }));
  };

  const handleQuickTypeCurrentMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setData({
      title: generateDefaultTitle('monthly'),
      type: 'monthly',
      from_date: firstDay.toISOString().split('T')[0],
      to_date: lastDay.toISOString().split('T')[0],
    });
  }

  const handleQuickTypeCurrentYear = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), 0, 1);
    const lastDay = new Date(now.getFullYear(), 11, 31);
    setData({
      title: generateDefaultTitle('yearly'),
      type: 'yearly',
      from_date: firstDay.toISOString().split('T')[0],
      to_date: lastDay.toISOString().split('T')[0],
    });
  }

  const handleQuickTypeLast30Days = () => {
    const now = new Date();
    const last30Days = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
    setData({
      title: generateDefaultTitle('custom'),
      type: 'custom',
      from_date: last30Days.toISOString().split('T')[0],
      to_date: now.toISOString().split('T')[0],
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Generate Report" />

      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Generate New Report</h1>
            <p className="text-sm text-muted-foreground">
              Create detailed financial reports for your selected period
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Report Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Report Configuration
              </CardTitle>
              <CardDescription>
                Configure your report parameters and generate insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Report Title</Label>
                  <Input
                    id="title"
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Enter report title..."
                    required
                  />
                  <InputError message={errors.title} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Report Type</Label>
                  <Select
                    value={data.type}
                    onValueChange={handleTypeChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <InputError message={errors.type} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from_date">From Date</Label>
                    <Input
                      id="from_date"
                      type="date"
                      value={data.from_date}
                      onChange={(e) => setData('from_date', e.target.value)}
                      required
                    />
                    <InputError message={errors.from_date} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to_date">To Date</Label>
                    <Input
                      id="to_date"
                      type="date"
                      value={data.to_date}
                      onChange={(e) => setData('to_date', e.target.value)}
                      required
                    />
                    <InputError message={errors.to_date} />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={processing} className="flex-1">
                    {processing ? 'Generating...' : 'Generate Report'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Quick Reports
                </CardTitle>
                <CardDescription>
                  Generate common reports with predefined periods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleQuickTypeCurrentMonth()}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Current Month Report
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleQuickTypeCurrentYear()}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Current Year Report
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleQuickTypeLast30Days()}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Last 30 Days Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Financial summary (income, expenses, net income)</li>
                  <li>• Breakdown by categories and accounts</li>
                  <li>• Monthly trends and patterns</li>
                  <li>• Top spending categories analysis</li>
                  <li>• Recent transactions overview</li>
                  <li>• Downloadable PDF format</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
