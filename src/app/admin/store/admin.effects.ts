import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as fromAdmin from './../store/admin.actions';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';
import { AdminService } from '../services/admin.service';
import { Project } from '../../projects/models/project.model';
import { of } from 'rxjs';
import { Track } from '../../tracks/models/track.model';


@Injectable()
export class AdminEffects {

  constructor(private actions$: Actions, private adminService: AdminService) {}

  @Effect()
  getUsersList$ = this.actions$.pipe(
    ofType(fromAdmin.AdminActionTypes.GET_USERS_LIST),
    switchMap( () => this.adminService.getUsersList()
      .pipe(
        map( (users: any) => {
          const usersList: any[] = users.map((res: any) => {
            const key = res.payload.key;
            const user: any = res.payload.val();
            return {
              key: key,
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              providerId: user.providerId,
              photoUrl: user.photoUrl,
              isNewUser: user.isNewUser,
              isAdmin: user.isAdmin,
              isOnline: user.isOnline
            };
          });
          return (new fromAdmin.UsersListFetched({ usersList }));
        }),
        catchError( (error: any) => of(new fromAdmin.AdminError({ error })))
      )
    )
  );

  @Effect()
  getUserProjects$ = this.actions$.pipe(
    ofType(fromAdmin.AdminActionTypes.GET_USER_PROJECTS),
    map((action: fromAdmin.GetUserProjects) => action.payload),
    mergeMap( (payload: any) => this.adminService.getUserProjects(payload.uid)
      .pipe(
        map((data: any) => {
          const projectsData: Project[] = data.map((res: any) => {
            const key = res.payload.key;
            const project: Project = res.payload.val();
            return {
              key: key || null,
              title: project.title || null,
              description: project.description || null,
              photoUrl: project.photoUrl || null
            };
          });
          return (new fromAdmin.UserProjectsLoaded({ uid: payload.uid, userProjects: projectsData }));
        }),
        catchError(error => of(new fromAdmin.AdminError({ error })))
      )
    )
  );

  @Effect({ dispatch: false })
  deleteUserProject$ = this.actions$.pipe(
    ofType(fromAdmin.AdminActionTypes.DELETE_USER_PROJECT),
    map( (action: fromAdmin.DeleteUserProject) => action.payload),
    switchMap( (payload: any) => this.adminService.deleteUserProject(payload.userId, payload.projectId)
      .pipe(
        catchError( (error: any) => of(new fromAdmin.AdminError({ error })))
      )
    )
  );

  @Effect()
  getUserTrack$ = this.actions$.pipe(
    ofType(fromAdmin.AdminActionTypes.GET_USER_TRACKS),
    map((action: fromAdmin.GetUserTracks) => action.payload),
    mergeMap( (payload: any) => this.adminService.getUserTracks(payload.uid)
      .pipe(
        map((data: any) => {
          const tracksData: Track[] = data.map((res: any) => {
            const key = res.payload.key;
            const track: Track = res.payload.val();
            return {
              key: key,
              id: track.id,
              name: track.name,
              description: track.description
            };
          });
          return (new fromAdmin.UserTracksLoaded({ uid: payload.uid, userTracks: tracksData }));
        }),
        catchError(error => of(new fromAdmin.AdminError({ error })))
      )
    )
  );

  @Effect({ dispatch: false })
  deleteUserTrack$ = this.actions$.pipe(
    ofType(fromAdmin.AdminActionTypes.DELETE_USER_TRACKS),
    map( (action: fromAdmin.DeleteUserTrack) => action.payload),
    switchMap( (payload: any) => this.adminService.deleteUserTrack(payload.userId, payload.trackId)
      .pipe(
        catchError( (error: any) => of(new fromAdmin.AdminError({ error })))
      )
    )
  );

  @Effect({ dispatch: false })
  addAdminPrivileges$ = this.actions$.pipe(
    ofType(fromAdmin.AdminActionTypes.ADD_ADMIN_PRIVILEGES),
    map( (action: fromAdmin.AddAdminPrivileges) => action.payload),
    switchMap( (payload: any) => this.adminService.addAdminPrivileges(payload.userId)
      .pipe(
        catchError( (error: any) => of(new fromAdmin.AdminError({ error })))
      )
    )
  );

  @Effect({ dispatch: false })
  removeAdminPrivileges$ = this.actions$.pipe(
    ofType(fromAdmin.AdminActionTypes.REMOVE_ADMIN_PRIVILEGES),
    map( (action: fromAdmin.RemoveAdminPrivileges) => action.payload),
    switchMap( (payload: any) => this.adminService.removeAdminPrivileges(payload.userId)
      .pipe(
        catchError( (error: any) => of(new fromAdmin.AdminError({ error })))
      )
    )
  );
}
