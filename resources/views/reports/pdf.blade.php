<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $report->title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 20px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #1a202c;
        }
        .subtitle {
            font-size: 14px;
            color: #718096;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #2d3748;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 5px;
        }
        .summary-grid {
            display: table;
            width: 100%;
            margin-bottom: 20px;
        }
        .summary-row {
            display: table-row;
        }
        .summary-cell {
            display: table-cell;
            width: 50%;
            padding: 10px;
            vertical-align: top;
        }
        .summary-card {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
        }
        .summary-card h4 {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #4a5568;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .summary-card .value {
            font-size: 20px;
            font-weight: bold;
            color: #1a202c;
        }
        .positive { color: #38a169; }
        .negative { color: #e53e3e; }
        .neutral { color: #4a5568; }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        th {
            background-color: #f7fafc;
            font-weight: bold;
            color: #2d3748;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 12px;
            color: #718096;
        }
        .no-data {
            text-align: center;
            padding: 20px;
            color: #718096;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">{{ $report->title }}</div>
        <div class="subtitle">
            {{ $report->type_label }} Report | 
            {{ \Carbon\Carbon::parse($report->from_date)->format('M d, Y') }} - {{ \Carbon\Carbon::parse($report->to_date)->format('M d, Y') }}
        </div>
    </div>

    <!-- Summary Overview -->
    <div class="section">
        <div class="section-title">Financial Summary</div>
        <table style="width: 100%; margin-bottom: 20px;">
            <tr>
                <td style="width: 50%; padding: 10px; vertical-align: top;">
                    <div class="summary-card">
                        <h4>Total Income</h4>
                        <div class="value positive">{{ number_format($report->summary['totals']['income'], 2) }}</div>
                    </div>
                </td>
                <td style="width: 50%; padding: 10px; vertical-align: top;">
                    <div class="summary-card">
                        <h4>Total Expenses</h4>
                        <div class="value negative">{{ number_format($report->summary['totals']['expenses'], 2) }}</div>
                    </div>
                </td>
            </tr>
            <tr>
                <td style="width: 50%; padding: 10px; vertical-align: top;">
                    <div class="summary-card">
                        <h4>Net Income</h4>
                        <div class="value {{ $report->summary['totals']['net_income'] >= 0 ? 'positive' : 'negative' }}">
                            {{ number_format($report->summary['totals']['net_income'], 2) }}
                        </div>
                    </div>
                </td>
                <td style="width: 50%; padding: 10px; vertical-align: top;">
                    <div class="summary-card">
                        <h4>Total Transactions</h4>
                        <div class="value neutral">{{ $report->summary['totals']['transactions_count'] }}</div>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <!-- Period Information -->
    <div class="section">
        <div class="section-title">Report Period</div>
        <table>
            <tr>
                <td><strong>From Date:</strong></td>
                <td>{{ \Carbon\Carbon::parse($report->summary['period']['from'])->format('F d, Y') }}</td>
            </tr>
            <tr>
                <td><strong>To Date:</strong></td>
                <td>{{ \Carbon\Carbon::parse($report->summary['period']['to'])->format('F d, Y') }}</td>
            </tr>
            <tr>
                <td><strong>Period Duration:</strong></td>
                <td>{{ $report->summary['period']['days'] }} days</td>
            </tr>
            <tr>
                <td><strong>Generated At:</strong></td>
                <td>{{ \Carbon\Carbon::parse($report->summary['generated_at'])->format('F d, Y g:i A') }}</td>
            </tr>
        </table>
    </div>

    <!-- Top Categories -->
    @if(!empty($report->summary['top_categories']))
    <div class="section">
        <div class="section-title">Top Expense Categories</div>
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th class="text-right">Amount</th>
                    <th class="text-center">Transactions</th>
                    <th class="text-center">Percentage</th>
                </tr>
            </thead>
            <tbody>
                @foreach($report->summary['top_categories'] as $category => $data)
                <tr>
                    <td>{{ $category }}</td>
                    <td class="text-right">{{ number_format($data['total'], 2) }}</td>
                    <td class="text-center">{{ $data['count'] }}</td>
                    <td class="text-center">{{ $data['percentage'] }}%</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <!-- Transactions by Account -->
    @if(!empty($report->summary['transactions_by_account']))
    <div class="section">
        <div class="section-title">Activity by Account</div>
        <table>
            <thead>
                <tr>
                    <th>Account</th>
                    <th class="text-right">Income</th>
                    <th class="text-right">Expenses</th>
                    <th class="text-center">Transactions</th>
                    <th class="text-right">Net</th>
                </tr>
            </thead>
            <tbody>
                @foreach($report->summary['transactions_by_account'] as $account => $data)
                <tr>
                    <td>{{ $account }}</td>
                    <td class="text-right positive">{{ number_format($data['income'], 2) }}</td>
                    <td class="text-right negative">{{ number_format($data['expenses'], 2) }}</td>
                    <td class="text-center">{{ $data['count'] }}</td>
                    <td class="text-right {{ ($data['income'] - $data['expenses']) >= 0 ? 'positive' : 'negative' }}">
                        {{ number_format($data['income'] - $data['expenses'], 2) }}
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <!-- Monthly Breakdown -->
    @if(!empty($report->summary['monthly_data']) && count($report->summary['monthly_data']) > 1)
    <div class="section">
        <div class="section-title">Monthly Breakdown</div>
        <table>
            <thead>
                <tr>
                    <th>Month</th>
                    <th class="text-right">Income</th>
                    <th class="text-right">Expenses</th>
                    <th class="text-center">Transactions</th>
                    <th class="text-right">Net</th>
                </tr>
            </thead>
            <tbody>
                @foreach($report->summary['monthly_data'] as $month => $data)
                <tr>
                    <td>{{ \Carbon\Carbon::createFromFormat('Y-m', $month)->format('F Y') }}</td>
                    <td class="text-right positive">{{ number_format($data['income'], 2) }}</td>
                    <td class="text-right negative">{{ number_format($data['expenses'], 2) }}</td>
                    <td class="text-center">{{ $data['transactions_count'] }}</td>
                    <td class="text-right {{ ($data['income'] - $data['expenses']) >= 0 ? 'positive' : 'negative' }}">
                        {{ number_format($data['income'] - $data['expenses'], 2) }}
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <!-- Recent Transactions -->
    @if(!empty($report->summary['recent_transactions']))
    <div class="section">
        <div class="section-title">Recent Transactions (Last 10)</div>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Account</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th class="text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                @foreach($report->summary['recent_transactions'] as $transaction)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($transaction['date'])->format('M d, Y') }}</td>
                    <td>{{ $transaction['description'] ?: 'N/A' }}</td>
                    <td>{{ $transaction['account'] }}</td>
                    <td>{{ $transaction['category'] }}</td>
                    <td>{{ ucfirst($transaction['type']) }}</td>
                    <td class="text-right {{ $transaction['type'] === 'income' ? 'positive' : 'negative' }}">
                        {{ number_format($transaction['amount'], 2) }}
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <div class="footer">
        <p>This report was generated on {{ \Carbon\Carbon::parse($report->summary['generated_at'])->format('F d, Y \a\t g:i A') }}</p>
        <p>Finance Tracker - Personal Financial Management System</p>
    </div>
</body>
</html>
