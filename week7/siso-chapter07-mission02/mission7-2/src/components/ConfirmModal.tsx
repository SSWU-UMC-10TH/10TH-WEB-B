interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
  }
  
  const ConfirmModal = ({ isOpen, onClose, onConfirm, message }: ConfirmModalProps) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
        <div className="bg-[#2c2c2e] w-full max-w-sm rounded-2xl p-8 relative flex flex-col items-center">
          {/* 우측 상단 X 버튼 */}
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
          
          <p className="text-white text-lg font-medium mb-8 mt-4 text-center">{message}</p>
  
          <div className="flex gap-4 w-full">
            <button 
              onClick={onConfirm}
              className="flex-1 bg-zinc-300 text-black py-3 rounded-lg font-bold hover:bg-zinc-400 transition"
            >
              예
            </button>
            <button 
              onClick={onClose}
              className="flex-1 bg-[#ff007f] text-white py-3 rounded-lg font-bold hover:bg-[#d10064] transition"
            >
              아니오
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ConfirmModal;