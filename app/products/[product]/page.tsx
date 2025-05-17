type Props ={
  params: {
    product: string
  }
}

export default function Home( { params }: Props) {
  const { product } = params;
  return (
    <div>
      <main>
        <h1>Welcome to product{params.product}</h1>
      </main>
    </div>
  );
}