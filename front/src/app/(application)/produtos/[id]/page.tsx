import api from "@/services/api";
import ViewProduto from "./_components/ViewProduto";

interface PageProps {
  params: {
    id: string;
  };
}


export default async function Produto({params}: PageProps) {

    const { id } = params;

    const response = await api.get(`api/v1/produtos/${id}`)

    if(!response.data){
        return (
          <div className="flex gap-x-4 items-center justify-evenly w-full">
              Not Found
          </div>
      );
    }

    return (
        <div className="flex gap-x-4 items-center justify-evenly w-full">
            <ViewProduto produto={response.data}/>
        </div>
    );
}
