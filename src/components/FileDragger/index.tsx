import SrcIcons from '@/assets/icons';
import Dragger from 'antd/lib/upload/Dragger';
import Image from 'next/legacy/image';
import React from 'react';

type Props = {
  data?: '';
};

const FileDragger = (props: Props) => {
  return (
    <Dragger
      className="h-full bg-[#F1F1F5] !rounded-[10px] !border-[3px] !border-dashed border-[#D5D5DC] !overflow-hidden"
      maxCount={1}
      onChange={(info) => {}}
    >
      <p className="ant-upload-drag-icon">
        <Image
          src={SrcIcons.file_plus}
          width={42}
          height={52}
          alt="youth enterprise"
          objectFit="contain"
        />
      </p>
      <p className="ant-upload-text">Kéo thả file vào đây hoặc chọn file từ máy tính</p>
      <p className="ant-upload-hint">Kích thước:</p>
    </Dragger>
  );
};

export default FileDragger;
