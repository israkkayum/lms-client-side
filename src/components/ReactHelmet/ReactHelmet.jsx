import { Helmet } from "react-helmet-async";

const ReactHelmet = ({ title }) => {
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
};

export default ReactHelmet;
