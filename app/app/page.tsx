import Main from '@/components/Main';
import Header from '@/components/Header';

export default async function Home() {

  return (
    <div className='h-screen overflow-hidden'>
        <Header homepage={true}/>
        <Main />
    </div>
  );
}
