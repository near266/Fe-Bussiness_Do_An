import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { getFilePlugin, RenderDownloadProps } from '@react-pdf-viewer/get-file';
import { Button } from 'antd';
interface IProps {
  fileUrl: string;
}

function PDF({ fileUrl }: IProps) {
  const getFilePluginInstance = getFilePlugin();
  const { Download } = getFilePluginInstance;

  const base64toBlob = (data: string) => {
    // Cut the prefix `data:application/pdf;base64` from the raw base 64
    const base64WithoutPrefix = data.substr('data:application/pdf;base64,'.length);

    const bytes = atob(base64WithoutPrefix);
    let length = bytes.length;
    const out = new Uint8Array(length);

    while (length--) {
      out[length] = bytes.charCodeAt(length);
    }

    return new Blob([out], { type: 'application/pdf' });
  };

  const testUrl = URL.createObjectURL(base64toBlob(fileUrl));
  return (
    <div className="min-w-[1000px] ">
      <div className="items-center flex p-1">
        <Download>
          {(props: RenderDownloadProps) => (
            <Button
              className="bg-primary hover:bg-primary text-white hover:text-white focus:bg-primary focus:text-white rounded-[10px] font-[600] leading-[21px] flex justify-center items-center w-auto px-[20px] py-[20px] drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)]"
              onClick={props.onClick}
            >
              Download
            </Button>
          )}
        </Download>
      </div>
      <div className="bg-[#e4e4e4] flex justify-center items-center overflow-y-auto mb-[10px] h-[1000px] w-full">
        <Worker workerUrl={`${process.env.NEXT_PUBLIC_PDF_CDN}`}>
          <Viewer fileUrl={testUrl} plugins={[getFilePluginInstance]}></Viewer>
        </Worker>
      </div>
    </div>
  );
}

export default PDF;
