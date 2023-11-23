import "./Tooltips.scss";

interface TooltipsProps {
	children: any,
	btnPosition? : number,
	closeTip: () => void,
}

export default function Tooltips({children, btnPosition, closeTip}: TooltipsProps)  {
	const setPosition = () => {
		if (btnPosition) {
			if (document.documentElement.clientWidth - btnPosition < 200) {
				return {right: "105%", borderTopRightRadius: "0px"};
			} return {left: "105%", borderTopLeftRadius: "0px"};
		} else return {left: "105%", borderTopLeftRadius: "0px"};
	};

	const clickOut = (e: { target: any }) => {
			closeTip();
      document.removeEventListener("click", clickOut); 
  };
	;
	setTimeout(() => document.addEventListener("click", clickOut), 0);
 return (
	<div className="tooltip" style={{...setPosition()}}>
		{children}
	</div>
 )
}