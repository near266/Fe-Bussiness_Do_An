import { Modal } from 'antd';
import React from 'react';
import PDF from './PDF';

export interface IProps {
  open: boolean;
  onChange(openState: boolean): void;
  fileUrl: string;
}

export function LicenseView({ open, onChange, fileUrl }: IProps) {
  const handleOk = () => {
    onChange(false);
  };
  return (
    <>
      <Modal className="min-w-[1100px]" open={open} onOk={handleOk} onCancel={handleOk}>
        <PDF fileUrl={fileUrl} />
      </Modal>
    </>
  );
}
