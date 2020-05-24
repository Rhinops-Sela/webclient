export interface INavigationService {
    navigate(path: string): void,
    navigateWithParameter(path: string, params: any): void
}