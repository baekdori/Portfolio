import React, { useState } from 'react';
import styles from './Dropdown.module.css';

const Dropdown = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (item) => {
    onSelect(item);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown}>
      <button className={styles.dropdownButton} onClick={() => setIsOpen(!isOpen)}>
        전시관 선택
      </button>
      {isOpen && (
        <ul className={styles.dropdownMenu}>
          {options.map((option) => (
            <li key={option.id} onClick={() => handleItemClick(option)}>
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
