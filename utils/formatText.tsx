import React from 'react';

/**
 * Mengubah string mentah menjadi elemen React dengan styling.
 * Menangani:
 * 1. >Greentext
 * 2. >>ReplyLinks (Stub)
 * 3. Line breaks
 */
export const formatPostContent = (content: string) => {
  if (!content) return null;

  return content.split('\n').map((line, index) => {
    // Case 1: Greentext (Diawali dengan >)
    // Regex: Cek apakah karakter pertama adalah '>' dan bukan '>>'
    if (line.startsWith('>') && !line.startsWith('>>')) {
      return (
        <React.Fragment key={index}>
          <span className="greentext">{line}</span>
          <br />
        </React.Fragment>
      );
    }

    // Case 2: Reply Link (Diawali dengan >>)
    if (line.startsWith('>>')) {
      // Logic ekstraksi ID bisa ditambahkan di sini
      return (
        <React.Fragment key={index}>
          <a href="#" className="text-blue-800 hover:underline">
            {line}
          </a>
          <br />
        </React.Fragment>
      );
    }

    // Case 3: Teks Biasa
    return (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    );
  });
};

/**
 * Helper untuk format ukuran file (bytes -> KB/MB)
 */
export const formatBytes = (bytes: number, decimals = 0) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};