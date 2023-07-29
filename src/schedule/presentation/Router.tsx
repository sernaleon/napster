export class Router {
    public static GetRoute(): string {
        return document.location.pathname.replace(process.env.PUBLIC_URL,'')
    }

    public static GoTo(newRoute: string) {
        document.location.pathname = `${process.env.PUBLIC_URL}/${newRoute}` 
    }
}

export default Router;