import { FileWithPath } from "./file";
import { Config, MeetingResult } from "./index";

export interface UploadWorkflowProps {
    uploadRef: React.RefObject<HTMLDivElement>;
    inputMode: 'upload' | 'live';
    setInputMode: (mode: 'upload' | 'live') => void;
    file: FileWithPath | null;
    config: Config;
    isPending: boolean;
    showLanding: boolean;
    handleFileSelect: (file: FileWithPath | null) => void;
    onProcess: () => void;
    onSummaryGenerated: (result: any) => void;
    transitionToDone: (result: MeetingResult) => void;
    setConfig: React.Dispatch<React.SetStateAction<Config>>;
}