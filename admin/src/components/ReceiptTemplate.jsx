import React from 'react';

const formatRp = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');

const ReceiptTemplate = React.forwardRef(({ transaction }, ref) => {
  if (!transaction) return null;

  const today = new Date();
  const formattedDate = today.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const terbilang = numberToWords(Number(transaction.amount || 0));

  // Tentukan label berdasarkan tipe transaksi
  const isJual = transaction.type === 'Jual';
  const untukText = isJual
    ? `Pembelian motor ${transaction.motor || ''}${transaction.nopol ? ' Nopol ' + transaction.nopol : ''}`
    : `Penjualan motor ${transaction.motor || ''}${transaction.nopol ? ' Nopol ' + transaction.nopol : ''}`;

  return (
    <div
      ref={ref}
      style={{
        fontFamily: "'Segoe UI', Arial, sans-serif",
        width: '800px',
        minHeight: '500px',
        margin: '0 auto',
        padding: '0',
        color: '#1a1a2e',
        backgroundColor: '#f5f0e8',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ===== HEADER ===== */}
      <div
        style={{
          textAlign: 'center',
          padding: '30px 40px 20px 40px',
        }}
      >
        <h1
          style={{
            fontSize: '32px',
            fontWeight: '800',
            margin: '0',
            color: '#1a1a4e',
            letterSpacing: '3px',
            fontFamily: "'Georgia', 'Times New Roman', serif",
          }}
        >
          KWITANSI PEMBAYARAN
        </h1>
        <h2
          style={{
            fontSize: '28px',
            fontWeight: '800',
            margin: '4px 0 0 0',
            color: '#1a1a4e',
            letterSpacing: '2px',
            fontFamily: "'Georgia', 'Times New Roman', serif",
          }}
        >
          UD BAGONG JAYA MOTOR
        </h2>
      </div>

      {/* ===== BODY ===== */}
      <div
        style={{
          display: 'flex',
          padding: '10px 40px 20px 40px',
          gap: '30px',
        }}
      >
        {/* LEFT — Form Fields */}
        <div style={{ flex: '1', minWidth: '0' }}>
          {/* Telah diterima dari */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: '700' }}>Telah diterima dari</span>
            <div
              style={{
                borderBottom: '2px solid #1a1a4e',
                paddingBottom: '4px',
                marginTop: '6px',
                fontSize: '15px',
                fontWeight: '500',
                minHeight: '22px',
              }}
            >
              {transaction.client || ''}
            </div>
          </div>

          {/* Uang sejumlah */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: '700' }}>Uang sejumlah</span>
            <div
              style={{
                borderBottom: '2px solid #1a1a4e',
                paddingBottom: '4px',
                marginTop: '6px',
                fontSize: '15px',
                fontWeight: '600',
                minHeight: '22px',
              }}
            >
              {formatRp(transaction.amount)}{' '}
              <span style={{ fontSize: '12px', fontWeight: '400', fontStyle: 'italic', color: '#555' }}>
                ({terbilang} rupiah)
              </span>
            </div>
          </div>

          {/* Untuk */}
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '14px', fontWeight: '700' }}>Untuk</span>
            <div
              style={{
                borderBottom: '2px solid #1a1a4e',
                paddingBottom: '4px',
                marginTop: '6px',
                fontSize: '15px',
                fontWeight: '500',
                minHeight: '22px',
              }}
            >
              {untukText}
            </div>
          </div>

          {/* Motor Image Placeholder */}
          <div style={{ marginTop: '20px' }}>
            <img
              src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=400&q=80"
              alt="Motor"
              style={{
                width: '200px',
                height: 'auto',
                opacity: '0.3',
                filter: 'grayscale(100%)',
              }}
            />
          </div>
        </div>

        {/* RIGHT — Info & No */}
        <div style={{ width: '220px', flexShrink: '0' }}>
          {/* Alamat */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '14px', fontWeight: '800', margin: '0 0 4px 0', color: '#1a1a4e' }}>Alamat</p>
            <p style={{ fontSize: '13px', margin: '0', lineHeight: '1.5', color: '#333' }}>
              Jl. Jaka Muda RT 001 RW 005
              <br />
              Desa Kaliboto Tarokan
              <br />
              Kediri
            </p>
          </div>

          {/* Telepon */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '14px', fontWeight: '800', margin: '0 0 4px 0', color: '#1a1a4e' }}>Telepon</p>
            <p style={{ fontSize: '14px', margin: '0', fontWeight: '600' }}>088989010342</p>
          </div>

          {/* No Kwitansi */}
          <div
            style={{
              border: '2px solid #1a1a4e',
              padding: '12px 16px',
              borderRadius: '4px',
              marginTop: '10px',
            }}
          >
            <p style={{ fontSize: '14px', fontWeight: '800', margin: '0 0 4px 0', color: '#1a1a4e' }}>No:</p>
            <p style={{ fontSize: '16px', fontWeight: '700', margin: '0', color: '#1a1a4e', letterSpacing: '1px' }}>
              {transaction.id || '-'}
            </p>
          </div>
        </div>
      </div>

      {/* ===== FOOTER — Tanda Tangan ===== */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px 40px 30px 40px',
          marginTop: '10px',
        }}
      >
        {/* Terima kasih */}
        <div style={{ textAlign: 'center', width: '200px' }}>
          <p style={{ fontSize: '14px', fontStyle: 'italic', margin: '0 0 60px 0', color: '#555' }}>
            Terima kasih
          </p>
          <div style={{ borderTop: '1px solid #1a1a4e', paddingTop: '6px' }}>
            <p style={{ fontSize: '12px', margin: '0', fontStyle: 'italic', color: '#888' }}>(Penerima)</p>
          </div>
        </div>

        {/* Tempat, Tanggal & TTD */}
        <div style={{ textAlign: 'center', width: '200px' }}>
          <p style={{ fontSize: '13px', margin: '0 0 60px 0', color: '#333' }}>Kediri, {formattedDate}</p>
          <div style={{ borderTop: '1px solid #1a1a4e', paddingTop: '6px' }}>
            <p style={{ fontSize: '12px', margin: '0', fontWeight: '600' }}>UD Bagong Jaya Motor</p>
          </div>
        </div>
      </div>

      {/* ===== FOOTER NOTE ===== */}
      <div
        style={{
          borderTop: '1px solid #ccc',
          padding: '10px 40px',
          textAlign: 'center',
          fontSize: '10px',
          color: '#aaa',
        }}
      >
        Dicetak: {today.toLocaleString('id-ID')}
      </div>
    </div>
  );
});

ReceiptTemplate.displayName = 'ReceiptTemplate';

// Function to convert number to Indonesian words
function numberToWords(num) {
  if (!num || num === 0) return 'nol';

  const ones = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
  const teens = ['sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas'];
  const tens = ['', '', 'dua puluh', 'tiga puluh', 'empat puluh', 'lima puluh', 'enam puluh', 'tujuh puluh', 'delapan puluh', 'sembilan puluh'];
  const scales = ['', 'ribu', 'juta', 'miliar', 'triliun'];

  let result = '';
  let scaleIndex = 0;
  let n = Math.abs(Math.floor(num));

  while (n > 0) {
    let groupValue = n % 1000;
    if (groupValue > 0) {
      // Special case: "seribu" bukan "satu ribu"
      if (groupValue === 1 && scaleIndex === 1) {
        result = 'seribu ' + result;
      } else {
        result = convertGroup(groupValue, ones, teens, tens) + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') + ' ' + result;
      }
    }
    n = Math.floor(n / 1000);
    scaleIndex++;
  }

  return result.trim();
}

function convertGroup(num, ones, teens, tens) {
  let result = '';

  if (num >= 100) {
    if (Math.floor(num / 100) === 1) {
      result += 'seratus ';
    } else {
      result += ones[Math.floor(num / 100)] + ' ratus ';
    }
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
