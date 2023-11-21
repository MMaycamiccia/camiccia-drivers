import React from "react";
import styles from "./Styles.module.css";

export default function Paginado({ driversPerPage, allDrivers, paginado, currentPage }) {
  const totalPages = Math.ceil(allDrivers.length / driversPerPage);

  // Obtener el rango de páginas a mostrar en el paginado
  const getPageRange = () => {
    const rangeSize = 5; // Tamaño del rango de páginas a mostrar
    const rangeMiddle = Math.ceil(rangeSize / 2);
    let start = currentPage - rangeMiddle + 1;
    let end = currentPage + rangeMiddle - 1;

    if (start < 1) {
      start = 1;
      end = Math.min(rangeSize, totalPages);
    } else if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - rangeSize + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumbers = getPageRange();

  const handleBack = () => {
    if (currentPage > 1) {
      paginado(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      paginado(currentPage + 1);
    }
  };

  return (
    <nav className={styles.paginadoContainer}>
      <ul className={styles.paginadoList}>
        <li className={styles.paginadoItem}>
          <a onClick={handleBack}>&lt;&lt; Back</a>
        </li>
        {pageNumbers.map((number) => (
          <li
            className={`${styles.paginadoItem} ${
              number === currentPage ? styles.active : ""
            }`}
            key={number}
          >
            <a onClick={() => paginado(number)}>{number}</a>
          </li>
        ))}
        <li className={styles.paginadoItem}>
          <a onClick={handleNext}>&gt;&gt; Next</a>
        </li>
      </ul>
    </nav>
  );
}
