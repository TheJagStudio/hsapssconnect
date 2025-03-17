import { useEffect } from "react";

const Toast = ({ message, onClose }) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, 5000);
		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div className={`fixed bottom-4 right-4 w-64 flex items-center gap-3 border px-4 py-3 rounded-lg shadow-lg z-50 bg-white`}>
			<div className="flex items-center gap-2 text-white">
				<div className="flex flex-col">
					<h6 className="leading-8 font-semibold text-primary-700 mb-1">{message?.title}</h6>
					<p className="text-sm font-normal text-gray-600">{message?.content}</p>
					<p className="text-sm font-normal text-gray-600 text-right">- {message?.sender}</p>
				</div>
			</div>
			<button onClick={onClose} className="text-primary-500 hover:text-primary-800 transition-colors absolute top-4 right-4">
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>
	);
};

export default Toast;
