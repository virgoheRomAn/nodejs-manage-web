import { CSSProperties, FunctionalComponent, defineAsyncComponent } from 'vue';

interface Options {
  size?: 'default' | 'small' | 'large';
  delay?: number;
  timeout?: number;
  loading?: boolean;
  retry?: boolean;
}

const LoadingComponent: FunctionalComponent<{ size: 'small' | 'default' | 'large' }> = (props) => {
  const style: CSSProperties = {
    position: 'fixed',
    width: '100%',
    height: '100%',
    zIndex: 999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div class="app-loading">
      <div class="app-loading-wrap">
        <div class="app-loading-dots">
          <span class="dot dot-spin"><i></i><i></i><i></i><i></i></span>
        </div>
      </div>
    </div>
  );
};

export function createAsyncComponent(loader: Fn, options: Options = {}) {
  const { delay = 100, timeout = 30000, loading = false, retry = true } = options;
  return defineAsyncComponent({
    loader,
    loadingComponent: loading ? LoadingComponent : undefined,
    timeout,
    delay,
    onError: !retry
      ? () => { }
      : (error, retry, fail, attempts) => {
        console.log(error, retry, fail, attempts)
        if (error.message.match(/fetch/) && attempts <= 3) {
          retry();
        } else {
          fail();
        }
      },
  });
}
