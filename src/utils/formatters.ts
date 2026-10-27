export function formatCurrency(amount: number, currency: string = 'AZN'): string {
  const symbolMap: Record<string, string> = {
    AZN: '₼',
    USD: '$',
    EUR: '€',
    GBP: '£',
    TRY: '₺',
    AED: 'د.إ',
    RUB: '₽',
    BTC: '₿',
    ETH: 'Ξ',
    USDT: '₮',
  };

  const symbol = symbolMap[currency] || currency;
  const isCrypto = ['BTC', 'ETH'].includes(currency);

  const formattedNum = isCrypto
    ? amount.toFixed(4)
    : new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);

  return `${formattedNum} ${symbol}`;
}

export function generateSvgQrMatrix(text: string): boolean[][] {
  // Deterministic 21x21 QR-like matrix generator based on string hash for vector display
  const size = 21;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Finder patterns at corners (7x7)
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startY + r][startX + c] = true;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(14, 0);
  drawFinder(0, 14);

  // Timing patterns
  for (let i = 8; i < 13; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Hash payload
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Don't overwrite finder patterns
      const inFinder1 = r < 8 && c < 8;
      const inFinder2 = r < 8 && c >= 13;
      const inFinder3 = r >= 13 && c < 8;
      if (!inFinder1 && !inFinder2 && !inFinder3) {
        const bit = Math.abs((hash ^ (r * 31 + c * 17)) % 100);
        matrix[r][c] = bit < 48;
      }
    }
  }

  return matrix;
}
