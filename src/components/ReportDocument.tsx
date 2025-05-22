import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from '@react-pdf/renderer';
import formatToBRL from '../utils/formatToBRL';

type Month = {
    monthName: string;
    incomingQty: number;
    incomingCost: number;
    outgoingQty: number;
    outgoingProfit: number;
};

type YearReport = {
    year: number;
    months: Month[];
    totalIncomingQty: number;
    totalIncomingCost: number;
    totalOutgoingQty: number;
    totalOutgoingProfit: number;
};

const styles = StyleSheet.create({
    page: { padding: 20, fontSize: 10, fontFamily: 'Helvetica' },
    header: { fontSize: 16, marginBottom: 10, textAlign: 'center' },
    table: { width: 'auto', marginBottom: 10 },
    tableRow: { flexDirection: 'row' },
    tableColHeader: {
        width: '20%',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        backgroundColor: '#eee',
        padding: 4,
        fontWeight: 'bold',
    },
    tableCol: {
        width: '20%',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        padding: 4,
    },
    totals: { marginTop: 10 },
    totalsText: { fontSize: 12, fontWeight: 'bold' },
});

interface Props {
    report: YearReport;
}

const ReportDocument: React.FC<Props> = ({ report }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.header}>Relatório Anual — {report.year}</Text>

            {/* Table Header */}
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    {['Mês', 'Entr. Qtde', 'Entr. Custo', 'Said. Qtde', 'Said. Lucro'].map((h, i) => (
                        <Text key={i} style={styles.tableColHeader}>{h}</Text>
                    ))}
                </View>

                {/* Table Body */}
                {report.months.map((m, idx) => (
                    <View style={styles.tableRow} key={idx}>
                        <Text style={styles.tableCol}>{m.monthName}</Text>
                        <Text style={styles.tableCol}>{m.incomingQty.toFixed(1)}</Text>
                        <Text style={styles.tableCol}>{formatToBRL(parseInt(m.incomingCost.toFixed(2)))}</Text>
                        <Text style={styles.tableCol}>{m.outgoingQty.toFixed(1)}</Text>
                        <Text style={styles.tableCol}>{formatToBRL(parseInt(m.outgoingProfit.toFixed(2)))}</Text>
                    </View>
                ))}
            </View>

            {/* Totals */}
            <View style={styles.totals}>
                <Text style={styles.totalsText}>
                    Total Entradas: {formatToBRL(parseInt(report.totalIncomingQty.toFixed(1)))}  |  {formatToBRL(parseInt(report.totalIncomingCost.toFixed(2)))}
                </Text>
                <Text style={styles.totalsText}>
                    Total Saídas: {formatToBRL(parseInt(report.totalOutgoingQty.toFixed(1)))}  |  {formatToBRL(parseInt(report.totalOutgoingProfit.toFixed(2)))}
                </Text>
            </View>
        </Page>
    </Document>
);

export default ReportDocument;