import React from 'react';

const formatRp = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');

const ReceiptTemplate = React.forwardRef(({ transaction }, ref) => {
  if (!transaction) return null;

  const today = new Date();
  const formattedDate = today.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div
      ref={ref}
      style={{
        fontFamily: 'Times New Roman, serif',
        padding: '60px 40px',
        maxWidth: '600px',
        margin: '0 auto',
        color: '#000',
        backgroundColor: '#fff',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          borderBottom: '3px solid #000',
          paddingBottom: '20px',
          marginBottom: '30px'
        }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', letterSpacing: '2px' }}>
          KWITANSI
        </h1>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
          BAGONG JAYA MOTOR
        </h2>
        <p style={{ fontSize: '13px', margin: '4px 0', color: '#333' }}>
          Jl. Raya Merdeka No. 123, Kota Bandung 40123
        </p>
        <p style={{ fontSize: '12px', margin: '2px 0', color: '#666' }}>
          Telepon: (022) 123-4567 | Email: info@bagongjayadmotor.com
        </p>
      </div>

      {/* Receipt Details */}
      <div style={{ marginBottom: '30px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ width: '35%', padding: '8px 0', fontSize: '14px', fontWeight: '500' }}>No. Kwitansi</td>
              <td style={{ padding: '8px 0', fontSize: '14px' }}>: <span style={{ fontWeight: 'bold' }}>{transaction.id}</span></td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontSize: '14px', fontWeight: '500' }}>Tanggal</td>
              <td style={{ padding: '8px 0', fontSize: '14px' }}>: {transaction.date}</td>
            </tr>
            <tr style={{ borderTop: '1px solid #ddd', marginTop: '10px' }}>
              <td style={{ padding: '12px 0 8px 0', fontSize: '14px', fontWeight: '500' }}>Nama Klien</td>
              <td style={{ padding: '12px 0 8px 0', fontSize: '14px' }}>: <span style={{ fontWeight: 'bold' }}>{transaction.client}</span></td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontSize: '14px', fontWeight: '500' }}>Motor</td>
              <td style={{ padding: '8px 0', fontSize: '14px' }}>: {transaction.motor}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontSize: '14px', fontWeight: '500' }}>Keperluan</td>
              <td style={{ padding: '8px 0', fontSize: '14px' }}>: Transaksi {transaction.type === 'Jual' ? 'Penjualan' : 'Pembelian'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Amount Section */}
      <div
        style={{
          backgroundColor: '#f5f5f5',
          border: '2px solid #000',
          padding: '20px',
          marginBottom: '30px',
          borderRadius: '4px'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px 0', fontSize: '14px', fontWeight: '500' }}>Jumlah Uang</td>
              <td style={{ padding: '8px 0', fontSize: '14px', textAlign: 'right' }}>
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  {formatRp(transaction.amount)}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '12px 0 8px 0', fontSize: '12px', fontStyle: 'italic' }} colSpan="2">
                Terbilang: {numberToWords(transaction.amount)} Rupiah
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Additional Info */}
      <div style={{ marginBottom: '40px', fontSize: '12px', color: '#666', lineHeight: '1.6' }}>
        <p style={{ margin: '0 0 6px 0' }}>
          <strong>Keterangan:</strong> Pembayaran telah diterima dengan baik untuk transaksi motor-motor pilihan berkualitas tinggi.
        </p>
        <p style={{ margin: '0' }}>
          Terima kasih atas kepercayaan Anda kepada Bagong Jaya Motor.
        </p>
      </div>

      {/* Signature Section */}
      <div
        style={{
          marginTop: '50px',
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '20px'
        }}
      >
        <div style={{ textAlign: 'center', width: '45%' }}>
          <p style={{ fontSize: '13px', margin: '0 0 60px 0', fontWeight: '500' }}>Penerima,</p>
          <p style={{ fontSize: '13px', margin: '0', borderTop: '1px solid #000', paddingTop: '4px', fontStyle: 'italic' }}>
            (_______________)
          </p>
        </div>

        <div style={{ textAlign: 'center', width: '45%' }}>
          <p style={{ fontSize: '13px', margin: '0 0 10px 0' }}>Bandung, {formattedDate}</p>
          <p style={{ fontSize: '13px', margin: '0 0 60px 0', fontWeight: '500' }}>Untuk Bagong Jaya Motor,</p>
          <p style={{ fontSize: '13px', margin: '0', borderTop: '1px solid #000', paddingTop: '4px' }}>
            <strong>Admin</strong>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: '60px',
          paddingTop: '20px',
          borderTop: '1px solid #ccc',
          textAlign: 'center',
          fontSize: '11px',
          color: '#999'
        }}
      >
        <p style={{ margin: '0' }}>
          Dokumen ini telah dibuat oleh sistem manajemen Bagong Jaya Motor
        </p>
        <p style={{ margin: '4px 0 0 0' }}>
          Print Date: {today.toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  );
});

ReceiptTemplate.displayName = 'ReceiptTemplate';

// Function to convert number to Indonesian words
function numberToWords(num) {
  const ones = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
  const teens = ['sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas'];
  const tens = ['', '', 'dua puluh', 'tiga puluh', 'empat puluh', 'lima puluh', 'enam puluh', 'tujuh puluh', 'delapan puluh', 'sembilan puluh'];
  const scales = ['', 'ribu', 'juta', 'miliar', 'triliun'];

  if (num === 0) return 'nol';

  let result = '';
  let scaleIndex = 0;

  while (num > 0) {
    let groupValue = num % 1000;
    if (groupValue > 0) {
      result = convertGroup(groupValue, ones, teens, tens) + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') + ' ' + result;
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }

  return result.trim();
}

function convertGroup(num, ones, teens, tens) {
  let result = '';

  if (num >= 100) {
    result += ones[Math.floor(num / 100)] + ' ratus ';
    num %= 100;
  }

  if (num >= 20) {
    result += tens[Math.floor(num / 10)] + ' ';
    num %= 10;
  } else if (num >= 10) {
    result += teens[num - 10] + ' ';
    num = 0;
  }

  if (num > 0) {
    result += ones[num] + ' ';
  }

  return result.trim();
}

export default ReceiptTemplate;
